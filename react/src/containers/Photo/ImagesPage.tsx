import * as React from 'react';
import { changeModule } from '../../store/app/actions';
import { AppState } from '../../store';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { Module } from '../../store/app/types';
import Welcome from '../Welcome';
import { withSize } from 'react-sizeme';
import MainPhoto from './MainPhoto';
import ThumnailsGalery from '../ThumnailsGalery';

interface ImagesPageProps {
  changeModule: typeof changeModule;
  size: any;
}

const ImagesPage: React.FC<ImagesPageProps> = props => {
  useEffect(() => {
    props.changeModule(Module.Image);
  });

  const mainElem = <MainPhoto screenWidth={props.size.width} screenHeight={props.size.height} />;

  const toolbarElem = <ThumnailsGalery screenWidth={props.size.width} />;

  return <Welcome mainElem={mainElem} toolbarElem={toolbarElem} />;
};

const mapStateToProps = (state: AppState) => ({});

export default withSize({ monitorHeight: true })(connect(mapStateToProps, { changeModule })(ImagesPage));
