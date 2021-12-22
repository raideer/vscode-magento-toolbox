import { useField } from 'informed';
import classnames from 'classnames';
import styles from './styles.module.scss';

const Select = (props: any) => {
  const { render, informed, userProps, ref } = useField({
    type: 'select',
    ...props
  });
  const { label, id, children, className, ...rest } = userProps as any;
  return render(
    <div>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <select className={classnames([className, styles.input])} id={id} ref={ref} {...informed} {...rest}>
        {children}
      </select>
    </div>
  );
};

export default Select;