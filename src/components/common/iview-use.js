import Vue from "vue";
import {
  Progress,
  Tabs,
  TabPane,
  Message,
  Tag,
  locale,
  Alert,
  TimePicker,
  Divider,
  Drawer,
  Upload,
  Scroll,
  CellGroup,
  Cell,
  Breadcrumb,
  BreadcrumbItem,
  CheckboxGroup,
  Checkbox,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Modal,
  Notice,
  Steps,
  Step,
  Spin,
  Tooltip,
  ButtonGroup,
  Button,
  Layout,
  Header,
  Content,
  Menu,
  Submenu,
  MenuGroup,
  MenuItem,
  Sider,
  Icon,
  Card,
  Form,
  FormItem,
  Select,
  Option,
  DatePicker,
  Input,
  Row,
  Col
} from "iview";
import lang from "iview/dist/locale/en-US";
locale(lang);
const components = {
  Alert,
  Progress,
  Tabs,
  TabPane,
  Message,
  Tag,
  TimePicker,
  Divider,
  Drawer,
  Upload,
  Scroll,
  CellGroup,
  Cell,
  Breadcrumb,
  BreadcrumbItem,
  CheckboxGroup,
  Checkbox,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button,
  Layout,
  Header,
  Content,
  Menu,
  MenuItem,
  Submenu,
  MenuGroup,
  Sider,
  ButtonGroup,
  Icon,
  Card,
  Form,
  FormItem,
  Select,
  Option,
  DatePicker,
  Tooltip,
  Spin,
  Steps,
  Step,
  Modal,
  Row,
  "i-Col": Col,
  "i-Input": Input
};

Vue.prototype.$Modal = Modal;
Vue.prototype.$Notice = Notice;
Vue.prototype.$Spin = Spin;
Vue.prototype.$Message = Message;

for (const attr in components) {
  if (components.hasOwnProperty(attr)) {
    Vue.component(attr, components[attr]);
  }
}

Message.config({
  top: 50,
  duration: 3
});
