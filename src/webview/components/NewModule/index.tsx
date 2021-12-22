import Form from '../common/Form/Form';
import Input from '../common/Form/Input';
import Select from '../common/Form/Select';
import Wrapper from '../common/Wrapper/index';
import classes from './styles.module.scss';
import formClasses from '../common/Form/styles.module.scss';
import classNames from 'classnames';
import { useState } from 'preact/hooks';

interface Props {
  vscode: any;
}

const nameValidator = (value: string) => {
  if (!value || value.length < 2) {
    return 'Input is required';
  }
};

const NewModule: React.FunctionComponent<Props> = ({ vscode }) => {
  const [error, setError] = useState('');

  const onSubmit = ({ valid, errors, values }: any) =>  {
    console.log(valid, errors, values);
    if (valid) {
      vscode.postMessage({ command: 'form', payload: values });
    }
  };

  const onChange = ({ invalid }: any) => {
    if (invalid) {
      setError('Form is invalid');
    }
  };

  return <Wrapper title="Create new Magento module">
    <Form onSubmit={onSubmit} onChange={onChange}>
      <div>{error}</div>
      <div className={classes.form}>
        <Input required name="vendor" label="Vendor*" placeholder="Vendor" validator={nameValidator} />
        <Input required name="module" label="Module*" placeholder="Module" validator={nameValidator} />
        <Input name="version" label="Setup Version" placeholder="Version" />
        <Input name="sequence" label="Sequence" placeholder="Sequence" />
        <Select name="license" label="License">
          <option value="none">No license</option>
          <option value="gplv3">GPL V3</option>
          <option value="mit">MIT</option>
        </Select>
        <Input name="copyright" label="Copyright" placeholder="Copyright" />
      </div>
      <button className={classNames([formClasses.button, classes.button])} type="submit">Submit</button>
    </Form>
  </Wrapper>;
};

export default NewModule;