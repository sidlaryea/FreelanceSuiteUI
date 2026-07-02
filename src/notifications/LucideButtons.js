import { CheckSquare, Square, Trash2 } from "lucide-react";

export function CheckboxIcon({ checked }) {
  return checked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />;
}

export function DeleteIcon() {
  return <Trash2 className="w-4 h-4" />;
}

