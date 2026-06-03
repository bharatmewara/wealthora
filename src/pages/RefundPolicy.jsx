import { RotateCcw } from 'lucide-react';
import PolicyPage from './PolicyPage';
export default function RefundPolicy() {
  return <PolicyPage sectionKey="refund_policy" title="Refund Policy" icon={RotateCcw} color="from-emerald-800 to-emerald-900" />;
}
