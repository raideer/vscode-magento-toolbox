import { useForm } from 'informed';

interface Props {
  onSubmit: (values: any) => void;
  onChange: (values: any) => void;
}

const Form: React.FunctionComponent<Props> = ({ children, ...rest }) => {
  const { formController, render, userProps } = useForm(rest);

  return render(
    <form {...userProps} onSubmit={formController.submitForm}>
      {children}
    </form>
  );
};

export default Form;
