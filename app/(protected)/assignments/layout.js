// app/assignments/layout.js
export const metadata = {
  title: "Assignments | Admin Disciplicando",
};

export default function AssignmentsLayout({ children }) {
  // Ojo: aquí NO usamos <html> ni <body>.
  // Solo devolvemos un contenedor normal.
  return <>{children}</>;
}