export default function NavBar({selectItem}) {
  return (
    <>
     <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Admin</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="#" onClick={()=>selectItem("meals")}>Meals</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" onClick={()=>selectItem("users")}>Users</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </>
  );
}
