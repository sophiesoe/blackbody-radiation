function Footer() {
  return (
    <div className="fixed bottom-0 w-full">
      <footer className="md:flex w-full justify-between items-center p-2 text-xs md:text-sm text-center md:text-left">
        <div>All rights reserves &copy; {new Date().getFullYear()}, </div>
        <div>
          <span className="text-[#f9f871]">Brisa, Varsheetha, Thin </span>
          <span>
            {"[ "}CSE P-batch{" ]"}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
