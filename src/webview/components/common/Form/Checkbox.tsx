import { useField } from 'informed';

const Checkbox = (props: any) => {
  const { render, informed, userProps, ref } = useField({
    type: 'checkbox',
    ...props,
  });
  const { label, id, ...rest } = userProps as any;
  return render(
    <div>
      <input id={id} ref={ref} {...informed} {...rest} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Checkbox;
