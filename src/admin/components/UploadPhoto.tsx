import * as React from 'react';
import {Box, DropZone, Label} from '@adminjs/design-system';
import {BasePropertyProps} from 'adminjs';

const blobToBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      resolve(reader.result);
    };
  });
};

const UploadPhoto: React.FC<BasePropertyProps> = (props) => {
  const { property, record, onChange } = props;

  const onUpload = async (files: any) => {
    const newRecord = { ...record };
    const file = files.length && files[0];
    const b64 = await blobToBase64(file);
    console.log(newRecord);
    onChange({
      ...newRecord,
      params: {
        ...newRecord.params,
        [property.name]: { file: b64 },
      },
    });
    event.preventDefault();
  };

  return (
    <Box>
      <Label style={{ marginBottom: 15 }}>{property.label}</Label>
      <DropZone onChange={(files) => onUpload(files)} />
    </Box>
  );
};

export default UploadPhoto;
