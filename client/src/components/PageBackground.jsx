const loginBg = import.meta.glob('/src/assets/login-bg.{png,jpg,jpeg,svg,webp,gif}', { eager: true });
const bgUrl = Object.values(loginBg)[0]?.default || null;

export default function PageBackground() {
  if (!bgUrl) {
    return <div className="fixed inset-0 -z-10 bg-gradient-to-br from-sand via-lilac-light to-lilac" />;
  }
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <img src={bgUrl} alt="" className="h-full w-full scale-110 object-cover blur-[4px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-plum-900/70 via-plum-800/55 to-plum-900/70" />
    </div>
  );
}
