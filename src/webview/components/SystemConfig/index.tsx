import Form from 'webview/components/common/Form/Form';
import Input from 'webview/components/common/Form/Input';
import Select from 'webview/components/common/Form/Select';
import Wrapper from 'webview/components/common/Wrapper/index';
import Checkbox from 'webview/components/common/Form/Checkbox';
import formClasses from 'webview/components/common/Form/styles.module.scss';
import classNames from 'classnames';
import { useState } from 'preact/hooks';
import { WebviewApi } from 'vscode-webview';
import classes from './styles.module.scss';

interface NewModuleData {
  loadedModules: string[];
}
interface Props {
  data: NewModuleData;
  vscode: WebviewApi<unknown>;
}

const nameValidator = (value: string) => {
  if (!value || value.length < 2) {
    return 'Input is required';
  }

  return false;
};

const SystemConfig: React.FunctionComponent<Props> = ({ vscode, data }) => {
  const [error, setError] = useState('');

  const onSubmit = ({ valid, values }: any) => {
    if (valid) {
      vscode.postMessage({ command: 'form', payload: values });
    }
  };

  const onChange = ({ invalid }: any) => {
    if (invalid) {
      setError('Form is invalid');
    }
  };

  return (
    <Wrapper title="Create new System config">
      <Form onSubmit={onSubmit} onChange={onChange}>
        <div>{error}</div>
        <div className={classes.form}>
          <Select required className={classes.select} name="module" label="Module">
            {data.loadedModules.map((mod: string) => {
              return (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              );
            })}
          </Select>
          <Input name="tab" label="Tab" placeholder="catalog" />
          <Checkbox className={classes.checkbox} name="new_tab" label="Generate new tab" />
          <Input
            required
            name="section"
            label="Section*"
            placeholder="section"
            validator={nameValidator}
          />
          <Input
            required
            name="group"
            label="Group*"
            placeholder="group"
            validator={nameValidator}
          />
          <Select name="type" label="Field type">
            <option value="text">Text</option>
            <option value="textarea">Textarea</option>
            <option value="select">Select</option>
            <option value="encrypted">Encrypted</option>
          </Select>
        </div>
        <button className={classNames([formClasses.button, classes.button])} type="submit">
          Submit
        </button>
      </Form>
    </Wrapper>
  );
};

export default SystemConfig;
