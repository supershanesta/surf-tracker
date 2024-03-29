import {SurfActivityType} from "@/types/types";
import {Button} from "@nextui-org/react";

interface flattenSurfActivityData {
  id: string;
  date: string;
  beachName: string;
  users: string;
  notes: string;
  rating: number | string;
  size: number | string;
  shape: number | string;
  createdBy: string;
}

const flattenSurfActivityData = (data: SurfActivityType[]): flattenSurfActivityData[] => {
  // Flatten each surf activity into rows that can be converted into CSV format
  return data.map((activity) => {
    // For properties like users, surfRatings, and mySurfRating, you'll want to extract relevant details
    // For simplicity, this example only extracts some fields, but you can adjust it as needed
    const users = activity.users.map((user) => `${user.firstName} ${user.lastName}`).join(", ");
    const mySurfRating = activity.mySurfRating;

    // Return a flat representation of the activity
    return {
      id: activity.id,
      date: activity.date,
      beachName: activity.beach.name,
      users,
      rating: mySurfRating?.rating || "N/A",
      size: mySurfRating?.size || "N/A",
      shape: mySurfRating?.shape || "N/A",
      notes: mySurfRating?.notes || "N/A",
      createdBy: `${activity.createdBy.firstName} ${activity.createdBy.lastName}`,
    };
  });
};

const convertToCSV = (flatData: flattenSurfActivityData[]): string => {
  const csvRows: string[] = [];
  // Assuming headers are statically known and match the flattenSurfActivityData keys
  const headers: (keyof flattenSurfActivityData)[] = [
    "id",
    "date",
    "beachName",
    "users",
    "rating",
    "size",
    "shape",
    "notes",
    "createdBy",
  ];
  csvRows.push(headers.join(",")); // Add headers row

  flatData.forEach((row) => {
    // Map each header to its corresponding value in the row
    const values = headers.map((header) => {
      // Use a type assertion here if necessary, though it should work without it
      // This ensures the value is treated as a string or whatever type is appropriate
      const value = row[header];
      // Convert undefined values to an empty string, and stringify others
      return JSON.stringify(value ?? "");
    });
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
};

const exportToCSV = (data: SurfActivityType[]) => {
  // Flatten the data
  const flatData = flattenSurfActivityData(data);
  // Convert flattened data to CSV
  const csvString = convertToCSV(flatData);

  const startDate = localStorage.getItem("startDate");
  const endDate = localStorage.getItem("endDate");

  // Create a Blob from the CSV String
  const blob = new Blob([csvString], {type: "text/csv;charset=utf-8;"});

  // Create a temporary link to trigger the download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `surf_activities-${startDate}-${endDate}.csv`); // Name of the file to be downloaded
  document.body.appendChild(link); // Append to document to make it work on Firefox

  // Trigger the download
  link.click();

  // Clean up by removing the temporary link
  document.body.removeChild(link);
};

interface Props {
  data: SurfActivityType[];
}

const ExportSessions: React.FC<Props> = ({data}) => {
  return (
    <Button size="sm" color="secondary" onClick={() => exportToCSV(data)}>
      Export to CSV
    </Button>
  );
};

export default ExportSessions;
