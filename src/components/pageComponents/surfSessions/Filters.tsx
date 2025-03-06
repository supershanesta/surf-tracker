import ExportSessions from '@/components/exports/ExportSessions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SurfActivityType } from '@/types/types';

interface SurfSessionFiltersProps {
  startDate: string;
  endDate: string;
  filterRating: number | undefined;
  filteredSurfExperiences: SurfActivityType[] | undefined;
  handleFilterStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterRatingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterReset: () => void;
}

export const SurfSessionFilters: React.FC<SurfSessionFiltersProps> = ({
  startDate,
  endDate,
  filterRating,
  filteredSurfExperiences,
  handleFilterStartDateChange,
  handleFilterEndDateChange,
  handleFilterRatingChange,
  handleFilterReset,
}) => {
  return (
    <div className="col-span-2 md:col-span-3 flex justify-center">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4">
        <div className="col-span-1">
          <label htmlFor="startDate" className="block text-sm mb-2">
            Start Date
          </label>
          <Input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleFilterStartDateChange}
            className="w-full"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="endDate" className="block text-sm mb-2">
            End Date
          </label>
          <Input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleFilterEndDateChange}
            className="w-full"
          />
        </div>

        <div className="col-span-1">
          <label htmlFor="filterRating" className="block text-sm mb-2">
            Rating
          </label>
          <Input
            type="number"
            id="filterRating"
            min={1}
            max={4}
            value={filterRating}
            onChange={handleFilterRatingChange}
            className="w-full"
          />
        </div>
        <div className="col-span-1 flex items-end">
          <Button
            variant="outline"
            onClick={handleFilterReset}
            className="w-full "
          >
            Reset Filters
          </Button>
        </div>

        {filteredSurfExperiences && (
          <div className="col-span-1 flex items-end">
            <ExportSessions data={filteredSurfExperiences} />
          </div>
        )}
      </div>
    </div>
  );
};
