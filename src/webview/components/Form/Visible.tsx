import { useFormikContext } from 'formik';

interface Props {
  when: (values: any) => boolean;
}

export const Visible: React.FC<Props> = ({ children, when }) => {
  const formik = useFormikContext();

  if (when(formik.values)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return null;
};
