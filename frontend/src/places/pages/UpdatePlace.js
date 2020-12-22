import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./PlaceForm.css";

const UpdatePlace = () => {
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;

  const { userId, token } = useContext(AuthContext);

  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false
      },
      description: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const resData = await sendRequest(
          `process.env.REACT_APP_BACKEND_URL + /places/${placeId}`
        );
        if (resData) {
          setLoadedPlace(resData.place);
          setFormData(
            {
              title: {
                value: resData.place.title,
                isValid: true
              },
              description: {
                value: resData.place.description,
                isValid: true
              }
            },
            true
          );
        }
      } catch (err) {
        throw new Error(err);
      }
    };

    fetchPlaceData();
  }, [placeId, sendRequest, setFormData]);

  const placeUpdateSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const resData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${token}`
          },
          body: JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value
          })
        }
      );
      if (resData) {
        history.push(`/${userId}/places`);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Place
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
