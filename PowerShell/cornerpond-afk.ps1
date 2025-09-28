param(
    [Parameter(Position=0)]
    [string]$Mode,
    [switch]$h,
    [switch]$help,
    [switch]$l,
    [switch]$loop,
    [switch]$o,
    [switch]$once,
    [switch]$t,
    [switch]$test
)

Add-Type -TypeDefinition @"
    using System;
    using System.Diagnostics;
    using System.Runtime.InteropServices;
    using System.Text;

    public class WindowAPI {
        [DllImport("user32.dll")]
        public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
        
        [DllImport("user32.dll")]
        public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
        
        [DllImport("user32.dll")]
        public static extern bool SetCursorPos(int x, int y);
        
        [DllImport("user32.dll")]
        public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, IntPtr dwExtraInfo);
        
        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();
        
        [DllImport("user32.dll")]
        public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
        
        [DllImport("user32.dll")]
        public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
        
        public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
        public const uint MOUSEEVENTF_LEFTUP = 0x0004;
        public const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
        public const uint MOUSEEVENTF_RIGHTUP = 0x0010;
    }

    public struct RECT {
        public int Left;
        public int Top;
        public int Right;
        public int Bottom;
    }
"@

$script:BaitBtnX = 0
$script:BaitBtnY = 0
$script:FishBtnX = 0
$script:FishBtnY = 0
$script:SellAllBtnX = 0
$script:SellAllBtnY = 0
$script:ResetPosX = 0
$script:ResetPosY = 0

function Write-LogMessage {
    param([string]$Message)
    $time = Get-Date -Format "HH:mm:ss"
    Write-Host "[$time] $Message"
}

function Find-GameWindow {
    $windowHandle = [WindowAPI]::FindWindow($null, "Cornerpond")
    
    if ($windowHandle -eq [IntPtr]::Zero) {
        try {
            Write-LogMessage "Searching for Cornerpond.exe process..."
            
            $cornerpond = Get-Process -Name "Cornerpond" -ErrorAction SilentlyContinue
            
            if ($cornerpond -and $cornerpond.MainWindowHandle -ne [IntPtr]::Zero) {
                Write-LogMessage "Found Cornerpond.exe with window handle!"
                return $cornerpond.MainWindowHandle
            }
            
            $allProcesses = Get-Process -ErrorAction SilentlyContinue | Where-Object { 
                $_.ProcessName -like "*Cornerpond*" -or 
                $_.MainWindowTitle -like "*Cornerpond*"
            }
            
            foreach ($process in $allProcesses) {
                if ($process.MainWindowHandle -ne [IntPtr]::Zero) {
                    Write-LogMessage "Found alternative Cornerpond process: $($process.ProcessName)"
                    return $process.MainWindowHandle
                }
            }
        }
        catch {
            Write-LogMessage "Error searching for processes: $($_.Exception.Message)"
        }
    }
    
    return $windowHandle
}

function Get-WindowPosition {
    param([IntPtr]$WindowHandle)
    
    $rect = New-Object RECT
    $success = [WindowAPI]::GetWindowRect($WindowHandle, [ref]$rect)
    
    if ($success) {
        return @{
            X = $rect.Left
            Y = $rect.Top
            Width = $rect.Right - $rect.Left
            Height = $rect.Bottom - $rect.Top
        }
    }
    return $null
}

function Compute-RelativePositions {
    Write-LogMessage "Searching for game window..."
    $gameWindow = Find-GameWindow
    
    Write-LogMessage "DEBUG: gameWindow handle = $gameWindow"
    Write-LogMessage "DEBUG: IntPtr.Zero = $([IntPtr]::Zero)"
    
    if ($gameWindow -eq [IntPtr]::Zero -or $gameWindow -eq $null) {
        Write-Host "Failed to locate Cornerpond game window." -ForegroundColor Red
        Write-Host "Make sure the game is running and visible." -ForegroundColor Yellow
        
        Write-Host "`nDebugging: All visible windows found:" -ForegroundColor Cyan
        try {
            $allProcesses = Get-Process | Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero }
            $windowCount = 0
            foreach ($proc in $allProcesses) {
                if ($proc.MainWindowTitle -ne "") {
                    Write-Host "  Process: $($proc.ProcessName) | Title: '$($proc.MainWindowTitle)'" -ForegroundColor Gray
                    $windowCount++
                }
            }
            Write-Host "Found $windowCount visible windows total." -ForegroundColor Cyan
        }
        catch {
            Write-Host "Could not enumerate windows: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        try {
            $cornerpond = Get-Process -Name "Cornerpond" -ErrorAction SilentlyContinue
            if ($cornerpond) {
                Write-Host "`nFound Cornerpond.exe process!" -ForegroundColor Green
                Write-Host "   Process ID: $($cornerpond.Id)" -ForegroundColor Yellow
                Write-Host "   Window Handle: $($cornerpond.MainWindowHandle)" -ForegroundColor Yellow
                Write-Host "   Window Title: '$($cornerpond.MainWindowTitle)'" -ForegroundColor Yellow
                Write-Host "   Has Window: $($cornerpond.MainWindowHandle -ne [IntPtr]::Zero)" -ForegroundColor Yellow
            } else {
                Write-Host "`nCornerpond.exe process not found!" -ForegroundColor Red
                Write-Host "Make sure the game is running." -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "`nError checking for Cornerpond process: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        exit 1
    }
    
    Write-LogMessage "Found game window with handle: $gameWindow"
    $windowPos = Get-WindowPosition -WindowHandle $gameWindow
    
    if ($windowPos -eq $null) {
        Write-Host "Failed to get window position, exiting." -ForegroundColor Red
        exit 1
    }
    
    $gwPosX = $windowPos.X
    $gwPosY = $windowPos.Y
    $gwWidth = $windowPos.Width
    $gwHeight = $windowPos.Height
    
    Write-LogMessage "Window: X=$gwPosX Y=$gwPosY W=$gwWidth H=$gwHeight"
    
    $script:BaitBtnX = [math]::Round($gwPosX + $gwWidth * 0.78)
    $script:BaitBtnY = [math]::Round($gwPosY + $gwHeight * 0.78)
    $script:FishBtnX = [math]::Round($gwPosX + $gwWidth * 0.42)
    $script:FishBtnY = [math]::Round($gwPosY + $gwHeight * 0.78)
    $script:SellAllBtnX = [math]::Round($gwPosX + $gwWidth * 0.7)
    $script:SellAllBtnY = [math]::Round($gwPosY + $gwHeight * 0.33)
    $script:ResetPosX = [math]::Round($gwPosX + $gwWidth * 0.92)
    $script:ResetPosY = [math]::Round($gwPosY + $gwHeight * 0.33)
    
    Write-LogMessage "Button positions:"
    Write-LogMessage "   Bait: ($($script:BaitBtnX), $($script:BaitBtnY))"
    Write-LogMessage "   Fish: ($($script:FishBtnX), $($script:FishBtnY))"
    Write-LogMessage "   Sell: ($($script:SellAllBtnX), $($script:SellAllBtnY))"
    Write-LogMessage "   Reset: ($($script:ResetPosX), $($script:ResetPosY))"
}

function Invoke-MouseClick {
    param(
        [int]$X,
        [int]$Y,
        [string]$Button = "Left"
    )
    
    Write-LogMessage "Clicking at ($X, $Y)"
    
    $moveSuccess = [WindowAPI]::SetCursorPos($X, $Y)
    Start-Sleep -Milliseconds 100
    
    if ($Button -eq "Left") {
        [WindowAPI]::mouse_event([WindowAPI]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, [IntPtr]::Zero)
        Start-Sleep -Milliseconds 50
        [WindowAPI]::mouse_event([WindowAPI]::MOUSEEVENTF_LEFTUP, 0, 0, 0, [IntPtr]::Zero)
        Start-Sleep -Milliseconds 50
    }
    
    return $moveSuccess
}

function Show-Banner {
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "    CORNERPOND AUTOFISHER v1.0      " -ForegroundColor Cyan  
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
}

function Invoke-SellAllFish {
    Write-LogMessage "Starting sell all fish sequence..."
    
    Write-LogMessage "   Step 1: Clicking fish button..."
    Invoke-MouseClick -X $script:FishBtnX -Y $script:FishBtnY
    Start-Sleep -Milliseconds 500
    
    Write-LogMessage "   Step 2: Clicking sell all button..."
    Invoke-MouseClick -X $script:SellAllBtnX -Y $script:SellAllBtnY
    Start-Sleep -Milliseconds 500
    
    Write-LogMessage "   Step 3: Clicking empty space to close GUI..."
    Invoke-MouseClick -X $script:ResetPosX -Y $script:ResetPosY
    Start-Sleep -Milliseconds 200
}

function Invoke-RefillBait {
    Write-LogMessage "Refilling bait..."
    Invoke-MouseClick -X $script:BaitBtnX -Y $script:BaitBtnY
}

function Invoke-FullAutomation {
    Compute-RelativePositions
    Invoke-RefillBait
    Start-Sleep -Milliseconds 500
    Invoke-SellAllFish
}

function Show-Help {
    Write-Host "Usage: cornerpond-afk.ps1 [OPTION]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  h or help         Display this help text and exit"
    Write-Host "  l or loop         Launch in forever loop mode"  
    Write-Host "  o or once         Launch only once"
    Write-Host "  t or test         Test mode - just move mouse to show click positions"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  cornerpond-afk.ps1 -l"
    Write-Host "  cornerpond-afk.ps1 -o"
    Write-Host "  cornerpond-afk.ps1 -t"
}

if ($h -or $help -or ($Mode -eq "h") -or ($Mode -eq "help")) {
    Show-Help
    exit 0
}
elseif ($t -or $test -or ($Mode -eq "t") -or ($Mode -eq "test")) {
    Show-Banner
    Write-LogMessage "TEST MODE - Watch your mouse cursor!"
    Compute-RelativePositions
    
    Write-LogMessage "Moving to BAIT button position in 3 seconds..."
    Start-Sleep -Seconds 3
    [WindowAPI]::SetCursorPos($script:BaitBtnX, $script:BaitBtnY)
    Start-Sleep -Seconds 2
    
    Write-LogMessage "Moving to FISH button position..."
    [WindowAPI]::SetCursorPos($script:FishBtnX, $script:FishBtnY)
    Start-Sleep -Seconds 2
    
    Write-LogMessage "Moving to SELL ALL button position..."
    [WindowAPI]::SetCursorPos($script:SellAllBtnX, $script:SellAllBtnY)
    Start-Sleep -Seconds 2
    
    Write-LogMessage "Moving to RESET position..."
    [WindowAPI]::SetCursorPos($script:ResetPosX, $script:ResetPosY)
    Start-Sleep -Seconds 2
    
    Write-LogMessage "Test complete! Did the cursor move to the right positions?"
}
elseif ($l -or $loop -or ($Mode -eq "l") -or ($Mode -eq "loop")) {
    Show-Banner
    $counter = 0
    Write-LogMessage "Starting infinite loop (stop with CTRL+C)"
    Start-Sleep -Seconds 1
    
    try {
        while ($true) {
            Write-LogMessage "READY? (5s)"
            Start-Sleep -Seconds 5
            Write-LogMessage "Executing automation! $counter"
            Invoke-FullAutomation
            Write-LogMessage "Sleep for 60s..."
            Start-Sleep -Seconds 60
            $counter++
        }
    }
    catch [System.Management.Automation.PipelineStoppedException] {
        Write-LogMessage "Automation stopped by user"
    }
}
elseif ($o -or $once -or ($Mode -eq "o") -or ($Mode -eq "once")) {
    Show-Banner
    Write-LogMessage "Executing automation once..."
    Invoke-FullAutomation
    Write-LogMessage "Automation END"
}
else {
    if ($Mode) {
        Write-Host "Unknown option: $Mode" -ForegroundColor Red
    }
    Show-Help
    exit 1
}
