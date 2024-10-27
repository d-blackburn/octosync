import {
  AccountCircleOutlined,
  BugReportOutlined, GitHub,
  SettingsOutlined
} from "@mui/icons-material";
import { MenuOption } from '../../models/menus/MenuOption';
import { User } from '../../github/user';

export function useDrawerOptions(user: User | null) {
  const accountOptions: MenuOption[] = [
    {
      icon: AccountCircleOutlined,
      label: 'Your profile',
      destination: user?.html_url ?? '',
      external: true,
    },
  ];

  const footerOptions: MenuOption[] = [
    {
      icon: GitHub,
      label: 'Repository',
      destination: 'https://github.com/d-blackburn/github-toolkit',
      external: true,
    },
    {
      icon: BugReportOutlined,
      label: 'Report a bug',
      destination: 'https://github.com/d-blackburn/github-toolkit/issues/new/choose',
      external: true,
    },
    {
      icon: SettingsOutlined,
      label: 'Settings',
      destination: '/settings',
      external: false,
    },
  ];

  return { accountOptions, footerOptions };
}
