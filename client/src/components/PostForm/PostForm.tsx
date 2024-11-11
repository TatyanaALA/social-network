import { FC, FormEventHandler, useState } from 'react';

import { Button } from '../Button';
import { FormField } from '../FormField';
import './PostForm.css';
import { useMutation } from '@tanstack/react-query';
import { createPost } from '../../api/Post';
import { queryClient } from '../../api/queryClient';

export interface IPostFormProps {}

export const PostForm: FC<IPostFormProps> = () => {
  const [text, setText] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const createPostMutation = useMutation(
    {
      mutationFn: () => createPost(text),
      onSuccess() {
        queryClient.invalidateQueries({queryKey: ["posts"] });
      },
    },
    queryClient
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (text.length > 10) {
      createPostMutation.mutate();
    } else {
      setErrorMessage("Введите более 10 символов");
    }

  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <FormField label="Текст поста">
        <textarea 
          className="post-form__input"
          value={text}
          onChange={(event) => {
            setText(event.currentTarget.value);
            setErrorMessage(undefined);
          }}
        />
      </FormField>

      {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}

      <Button 
        type="submit" 
        title="Опубликовать"
        isLoading={createPostMutation.isPending} />
    </form>
  );
};
