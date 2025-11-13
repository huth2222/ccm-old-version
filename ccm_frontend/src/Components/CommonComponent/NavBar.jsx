import ProfileMenu from "./ProfileMenu";

export default function NavBar({ headerText }) {
  return (
    <>
      <div className="flex justify-between py-4 px-6 bg-[#0B834E]">
        <h1 className="text-white text-4xl">{headerText}</h1>
        <ProfileMenu />
      </div>
    </>
  );
}
