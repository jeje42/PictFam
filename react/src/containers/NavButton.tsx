import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigatePrevIcon from '@material-ui/icons/NavigateBefore';
import Fab from '@material-ui/core/Fab';

interface MainPhotoProps {
  onClick: () => void;
  previous: boolean;
  disabled: boolean;
}

const NavButton: React.SFC<MainPhotoProps> = props => {
  const useStyles = makeStyles((theme: any) => ({
    margin: {
      margin: theme.spacing(1),
    },
  }));
  const classes = useStyles();

  let iconElem = <NavigateNextIcon />;
  if (props.previous) {
    iconElem = <NavigatePrevIcon />;
  }

  return (
    <Fab color='primary' aria-label='add' className={classes.margin} onClick={props.onClick} disabled={props.disabled}>
      {iconElem}
    </Fab>
  );
};

export default NavButton;
