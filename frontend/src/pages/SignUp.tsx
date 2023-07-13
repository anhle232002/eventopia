import { signUp } from "@/api/signup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
function SignUp() {
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, watch, unregister } = useForm();
  const [error, setError] = useState("");
  watch("isOrganizer");

  const onHandleSignUp = async (data: any) => {
    try {
      await signUp(data);

      navigate("/login");
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    if (!getValues("isOrganizer")) {
      unregister("organizer");
    }
  }, [getValues("isOrganizer")]);
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 center py-20">
        <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="card-title text-2xl text-primary">Eventopia</h2>

            <h2 className="card-title text-4xl">Create an account</h2>
            <form onSubmit={handleSubmit(onHandleSignUp)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="admin@gmail.com"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Given Name</span>
                </label>
                <input
                  {...register("givenName", { required: true })}
                  type="text"
                  placeholder="John"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Family Name</span>
                </label>
                <input
                  {...register("familyName", { required: true })}
                  type="text"
                  placeholder="Doe"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Are you a organizer</span>
                  <input {...register("isOrganizer")} type="checkbox" className="checkbox" />
                </label>
              </div>
              {getValues().isOrganizer && (
                <>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Organizer Email</span>
                    </label>
                    <input
                      {...register("organizer.email", { required: true })}
                      type="email"
                      placeholder="organizer@example.com"
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Organizer Name</span>
                    </label>
                    <input
                      {...register("organizer.name", { required: true })}
                      type="text"
                      placeholder="Organizer Name"
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input
                      {...register("organizer.phone", { required: true })}
                      type="text"
                      placeholder="1234567890"
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Organizer Description</span>
                    </label>
                    <textarea
                      {...register("organizer.description", { required: true })}
                      className="textarea textarea-bordered"
                      placeholder="Enter organizer description"
                    ></textarea>
                  </div>
                </>
              )}

              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Sign up
                </button>
              </div>

              {error !== "" && <div className="mt-4 text-center text-error">{error}</div>}
            </form>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundImage:
            "url('https://cdn.evbstatic.com/s3-build/perm_001/0fff4c/django/images/login/lateral-image-2-hd.jpg')",
        }}
        className="flex-1 bg-no-repeat bg-cover"
      >
        asds
      </div>
    </div>
  );
}
export default SignUp;
