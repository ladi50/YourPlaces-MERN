import React, { useEffect, useRef, useState } from "react";

import Button from "./Button";

import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    if (fileReader.error) {
      throw new Error("Could not upload your image. Please try again.");
    }

    fileReader.onloadend = () => {
      setPreviewUrl(fileReader.result);
    };
  }, [file]);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (e) => {
    let pickedFile, fileIsValid;

    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      setPreviewUrl(null);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    <div className="form-control">
      <input
        type="file"
        ref={filePickerRef}
        id={props.id}
        style={{ display: "none" }}
        accept=".png, .jpeg, .jpg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please choose an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Choose Image
        </Button>
      </div>
      {!isValid && previewUrl && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
