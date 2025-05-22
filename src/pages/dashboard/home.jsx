import formio from "~/core/formio.json";
import FormLoader from "~/core/FormLoader";

const Home = () => {
    return (
        <FormLoader jsonSchema={formio} />
    )
}

export default Home;