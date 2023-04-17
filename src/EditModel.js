
import React, { useState } from 'react';
import { Modal, Form, Input, Typography } from 'antd';

const EditCredentialsModal = ({ visible, onCancel, onSave,  website, username, password}) => {
  const [form] = Form.useForm();
  const [hasChanges, setHasChanges] = useState(false);

  React.useEffect(()=>{
    console.log('username ',username)
    console.log('password ',password)
    console.log('website ',website)
  },[]);


  const handleSaveClick = () => {
    form.validateFields().then((values) => {
        if(values.username === username && values.password === password){
            console.warn("no changes")
        }else{
            onSave(values.website, values.username, values.password);
        }
        form.resetFields();
    });
  };

  const handleCancelClick = () => {
    onCancel();
    form.resetFields();
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    setHasChanges(
      values.website !== website ||
        values.username !== username ||
        values.password !== password
    );
  };


  return (
    <Modal open={visible} onCancel={handleCancelClick} onOk={handleSaveClick} okButtonProps={{ disabled: !hasChanges }}>
      <Form form={form} initialValues={{ website, username, password }} onValuesChange={handleFormChange} >
        
          {<Typography.Title level={3} align={'center'}>{website}</Typography.Title>}

        <Form.Item name="username" label="Username">
          { <Input id={"username"}/>}
        </Form.Item>
        <Form.Item name="password" label="Password">
          { <Input.Password id={"password"} /> }
        </Form.Item>
      </Form>

    </Modal>
  );
};

export default EditCredentialsModal