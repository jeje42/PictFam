import * as React from 'react';
import { changeModule } from '../../store/app/actions';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { Module } from '../../store/app/types';
import Welcome from '../Welcome';
import { withSize } from 'react-sizeme';
import MainVideo from './MainVideos';

interface ImagesPageProps {
  changeModule: typeof changeModule;
  size: any;
}

const ImagesPage: React.FC<ImagesPageProps> = props => {
  useEffect(() => {
    props.changeModule(Module.Video);
  });

  const mainElem = <MainVideo screenWidth={props.size.width} screenHeight={props.size.height} />;

  return <Welcome mainElem={mainElem} toolbarElem={undefined} />;
};

const mapStateToProps = (state: AppState) => ({});

export default withSize({ monitorHeight: true })(connect(mapStateToProps, { changeModule })(ImagesPage));
