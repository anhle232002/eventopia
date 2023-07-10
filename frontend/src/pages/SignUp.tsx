import GoogleIcon from "@/assets/google-icon.svg";
function SignUp() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 center">
        <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="card-title text-2xl text-primary">Eventopia</h2>

            <h2 className="card-title text-4xl">Create an account</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="text" placeholder="admin@gmail.com" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="text" placeholder="password" className="input input-bordered" />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Sign up</button>
            </div>

            <div className="divider">or</div>

            <button className="btn btn-outline">
              <img className="w-6 h-6 mr-2" src={GoogleIcon} alt="" />
              Sign in with Google
            </button>
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
