
namespace Research.EndToEndTests
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Diagnostics;
    using System.Runtime.InteropServices;

    [TestClass]
    public class ResearchTester
    {
        
        [TestMethod]
        public void Test()
        {
            Reliable_set_window_to_forground();
            Assert.IsTrue(true);
        }

        public void Reliable_set_window_to_forground()
        {
            Process[] processes = Process.GetProcesses();
            foreach (Process proc in processes)
            {
                if (ProcessIsNotepad(proc))
                {
                    ActivateWindow(proc.MainWindowHandle);
                }
            }
        }

        public bool ProcessIsNotepad(Process proc) 
        {
            return proc.MainWindowTitle.EndsWith("Notepad", StringComparison.InvariantCultureIgnoreCase);
        }
        
        private const int ALT = 0xA4;
        private const int EXTENDEDKEY = 0x1;
        private const int KEYUP = 0x2;
        private const int SHOW_MAXIMIZED = 3;

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();
        [DllImport("user32.dll")]
        private static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hWnd);
        [DllImport("user32.dll")]
        private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        
        public static void ActivateWindow(IntPtr mainWindowHandle)
        {
            // Guard: check if window already has focus.
            if (mainWindowHandle == GetForegroundWindow()) return;

            // Show window maximized.
            ShowWindow(mainWindowHandle, SHOW_MAXIMIZED);
            
            // Simulate an "ALT" key press.
            keybd_event((byte)ALT, 0x45, EXTENDEDKEY | 0, 0);
                        
            // Simulate an "ALT" key release.
            keybd_event((byte)ALT, 0x45, EXTENDEDKEY | KEYUP, 0);

            // Show window in forground.
            SetForegroundWindow(mainWindowHandle);
        }
    }
}
