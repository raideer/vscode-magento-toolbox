import { useField } from 'informed';
import classnames from 'classnames';
import styles from './styles.module.scss';

const Input = (props: any) => {
  const { render, informed, userProps, ref } = useField({
    type: 'text',
    ...props
  });
  const { label, id, className, ...rest } = userProps as any;
  return render(
    <div>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input className={classnames([className, styles.input])} id={id} ref={ref} {...informed} {...rest} />
    </div>
  );
};

export default Input;