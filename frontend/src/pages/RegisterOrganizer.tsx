import { registerOrganizer } from "@/api/register-organizer";
import MainLayout from "@/components/layouts/MainLayout";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterOrganizer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (fileInput.current?.files && fileInput.current.files[0]) {
        const picture = fileInput.current.files[0];

        setIsLoading(true);

        await registerOrganizer({ description, email, picture, name, phoneNumber });

        setIsLoading(false);

        navigate("/dashboard");
      }
    } catch (err: any) {
      console.log(err);

      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl m-auto mt-10 p-6 border-2 border-neutral/50 rounded">
      <h3 className="text-center font-semibold text-3xl">Become an organizer</h3>
      <form onSubmit={handleSubmitForm} className=" px-10 gap-4 mt-4 space-y-6" action="">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">What is your organizer name?</span>
          </label>
          <input
            type="text"
            required
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered input-sm w-full "
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">What is your organizer email?</span>
          </label>
          <input
            type="text"
            required
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered input-sm w-full"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Some description about your organizer</span>
          </label>
          <textarea
            name="description"
            className="textarea textarea-bordered"
            placeholder="Bio"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Phone number</span>
          </label>

          <input
            type="text"
            required
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input input-bordered input-sm w-full"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Organizer image</span>
          </label>
          <input
            type="file"
            required
            name="picture"
            accept="image/*"
            ref={fileInput}
            className="file-input file-input-bordered file-input-sm w-full max-w-xs"
          />
        </div>

        <div className="text-right">
          <button className="btn btn-primary btn-sm ">
            {isloading && <span className="loading loading-xs loading-spinner"></span>}
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
export default RegisterOrganizer;
