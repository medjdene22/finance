import Header from "@/components/header";

export default function dashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        <Header/>
        <main className='px-3 lg:px-14'>{children}</main>
      </div>
    
  );
}
