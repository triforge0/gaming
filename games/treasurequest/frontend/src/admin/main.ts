import { AdminApp } from './AdminApp';
import './admin.css';

const mount = document.getElementById('admin-root');
if (mount) {
  new AdminApp(mount);
}
