import React from 'react';
import { createStyles, makeStyles, MuiThemeProvider, Theme } from '@material-ui/core/styles';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { Video } from '../../types/Video';
import MaterialTable from 'material-table';
import theme from '../../theme';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Grid } from '@material-ui/core';
import { selectVideoForReading } from '../../store/video/actions';

interface VideoTabProps {
  videos: Video[];
  selectVideoForReading: typeof selectVideoForReading;
  switchToPlayer: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

const VideoTab: React.FC<VideoTabProps> = props => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item lg={5}>
            <MuiThemeProvider theme={theme}>
              <MaterialTable
                title={`Films dans l'album`}
                columns={[{ title: 'Nom', field: 'name' }]}
                data={props.videos}
                options={{
                  filtering: true,
                  fixedColumns: {
                    left: 2,
                    right: 0,
                  },
                }}
                actions={[
                  {
                    // eslint-disable-next-line react/display-name
                    icon: () => <PlayArrowIcon />,
                    tooltip: 'Lire le film',
                    onClick: (event: any, rowData: any) => {
                      props.selectVideoForReading(rowData as Video);
                      props.switchToPlayer();
                    },
                  },
                ]}
              />
            </MuiThemeProvider>
          </Grid>
          <Grid item lg={5}>
            left part
          </Grid>
        </Grid>
      </div>
    </>

    // <>
    //   {props.videos.map(video => (
    //     <div key={video.}>{video.name}</div>
    //   ))}
    // </>
  );
};

const mapStateToProps = (state: AppState) => ({
  videos: state.videos.videosSelected,
});

export default connect(mapStateToProps, { selectVideoForReading })(VideoTab);
