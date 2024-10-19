import { BugReportOutlined, GitHub } from '@mui/icons-material';
import { MenuOption } from '../../models/menus/menuOption';

export function useDrawerOptions() {
  const accountOptions: MenuOption[] = [];

  const footerOptions: MenuOption[] = [
    {
      icon: GitHub,
      label: 'Repository',
      destination: 'https://github.com/d-blackburn/octosync',
      external: true,
    },
    {
      icon: BugReportOutlined,
      label: 'Report a bug',
      destination: 'https://github.com/d-blackburn/octosync/issues/new/choose',
      external: true,
    },
  ];

  return { accountOptions, footerOptions };
}
