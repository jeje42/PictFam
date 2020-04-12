import React, { useEffect, useState } from 'react';
import { AppState } from '../store';
import { connect } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CircularProgress, Zoom } from '@material-ui/core';

interface MyImgElementProps {
  imgUrl: string;
  styleRaw?: any;
  token: string;
}

const defaultImage =
  'data:image/png;base64,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';

const useStylesForSpinner = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    fabProgress: {
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1,
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);

const MyImgElement: React.FC<MyImgElementProps> = props => {
  const [base64img, setBase64img] = useState<Blob>();

  useEffect(() => {
    setBase64img(undefined);
  }, [props.imgUrl]);

  const useStyles = makeStyles(() => ({
    img: props.styleRaw,
  }));

  const classes = useStyles();
  const classesForSpinner = useStylesForSpinner();

  if (base64img === undefined) {
    fetch(props.imgUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${props.token}`,
      },
    })
      .then(res => res.blob())
      .then(content => {
        setBase64img(content);
      });
  }

  let imgDefault;
  let imgLoaded;
  if (base64img === undefined) {
    imgDefault = (
      <Zoom in={true} style={{ transitionDelay: base64img === undefined ? '0ms' : '1000ms' }}>
        <div className={classesForSpinner.root}>
          <div className={classesForSpinner.wrapper}>
            <img className={classes.img} src={defaultImage} alt={`Rien à montrer encore`} />
            <CircularProgress size={60} className={classesForSpinner.buttonProgress} />
          </div>
        </div>
      </Zoom>
    );
  } else {
    imgLoaded = (
      <Zoom in={true} style={{ transitionDelay: base64img !== undefined ? '0ms' : '500ms' }}>
        <img className={classes.img} src={URL.createObjectURL(base64img)} alt={`Rien à montrer encore`} />
      </Zoom>
    );
  }

  return (
    <div>
      {imgDefault}
      {imgLoaded}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps, {})(MyImgElement);
