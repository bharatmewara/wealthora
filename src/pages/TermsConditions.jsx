import { FileText } from 'lucide-react';
import PolicyPage from './PolicyPage';
export default function TermsConditions() {
  return <PolicyPage sectionKey="terms_conditions" title="Terms & Conditions" icon={FileText} color="from-indigo-800 to-indigo-900" />;
}
