// src/components/windows/Settings/AccessibilityWindow.jsx
// System Settings, opened straight on the Accessibility pane (its own entry in the This Mac stack).
import SettingsWindow from "./SettingsWindow";

export default function AccessibilityWindow(props) {
  return <SettingsWindow {...props} initialPane="accessibility" />;
}
