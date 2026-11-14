import { Title, Desc } from "docbook-ui-package";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Title>Clinic Administration</Title>
        <Desc>
          Control clinic configuration, staff permissions, pricing, and QR booking setup.
        </Desc>
      </div>
    </div>
  );
}
