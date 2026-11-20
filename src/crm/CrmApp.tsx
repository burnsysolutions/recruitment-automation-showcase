import { Navigate, Route, Routes } from "react-router-dom";
import { CrmShell } from "./Shell";
import { Desk } from "./Desk";
import { CandidatesList, CandidateRecord } from "./Candidates";
import { ClientsList, ClientRecord, ContactsList } from "./Clients";
import { JobsBoard, JobRecord, Placements } from "./Jobs";
import { SearchPage } from "./Search";
import { Mailshots } from "./Mailshots";
import { TasksPage } from "./Tasks";
import { TimesheetsList, TimesheetDetail, ChaseBoard } from "./Timesheets";
import { Payroll } from "./Payroll";
import { InvoicesList, InvoiceDoc } from "./Invoices";
import { ShortlistsList, ShortlistDetail } from "./Shortlists";
import { Availability, Compliance, Prospects } from "./Automations";
import { SettingsPage } from "./Settings";


export default function CrmApp() {
  return (
    <Routes>
        <Route path="/" element={<CrmShell />}>
          <Route index element={<Desk />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="candidates" element={<CandidatesList />} />
          <Route path="candidates/:id" element={<CandidateRecord />} />
          <Route path="jobs" element={<JobsBoard />} />
          <Route path="jobs/:id" element={<JobRecord />} />
          <Route path="clients" element={<ClientsList />} />
          <Route path="clients/:id" element={<ClientRecord />} />
          <Route path="contacts" element={<ContactsList />} />
          <Route path="placements" element={<Placements />} />
          <Route path="timesheets" element={<TimesheetsList />} />
          <Route path="timesheets/:id" element={<TimesheetDetail />} />
          <Route path="chase" element={<ChaseBoard />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="invoices" element={<InvoicesList />} />
          <Route path="invoices/:id" element={<InvoiceDoc />} />
          <Route path="shortlists" element={<ShortlistsList />} />
          <Route path="shortlists/:id" element={<ShortlistDetail />} />
          <Route path="availability" element={<Availability />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="prospects" element={<Prospects />} />
          <Route path="mailshots" element={<Mailshots />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/crm" replace />} />
        </Route>
    </Routes>
  );
}
