import { AuthGate } from './components/AuthGate';
import { Workstation } from './components/Workstation';

export default function App() {
  return <AuthGate>{(session) => <Workstation session={session} />}</AuthGate>;
}
