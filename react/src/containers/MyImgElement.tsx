import React, {useEffect, useState} from "react";
import {AppState} from "../store";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";

interface MyImgElementProps {
    imgUrl: string,
    token: string,
    styleRaw: any
}

const MyImgElement: React.FC<MyImgElementProps> = (props) => {
    const [base64img, setBase64img] = useState<Blob>()

    const useStyles = makeStyles((theme: any) => ({
        img: props.styleRaw,
    }))

    const classes = useStyles()

    useEffect(() => {
        fetch(props.imgUrl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        }).then(res => res.blob())
            .then(content => {
                setBase64img(content)
            })
    }, [props.imgUrl])

    let imageUrl
    if (base64img !== undefined) {
       imageUrl = URL.createObjectURL(base64img)
    }
    return (
        <img
            className={classes.img}
            src={imageUrl}
        />
    )
}

const mapStateToProps = (state: AppState) => ({
    token: state.auth.token
})

export default connect(mapStateToProps, {})(MyImgElement)