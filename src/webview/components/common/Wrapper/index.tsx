import styles from './styles.module.scss';

interface Props {
  title: string;
}

const Wrapper: React.FunctionComponent<Props> = ({
  title,
  children
}) => {
  return <div className={styles.root}>
    <h1>{title}</h1>
    {children}
  </div>;
};

export default Wrapper;