'use client';
import { useState } from 'react';

import { debounce } from 'lodash';
import {
  CSSObjectWithLabel,
  GetOptionLabel,
  GroupBase,
  OptionsOrGroups,
  StylesConfig,
} from 'react-select';
import AsyncSelect from 'react-select/async';

import { Location, User } from '@prisma/client';

export enum SelectType {
  Beach = 'Beach',
  User = 'User',
}

const customStyles: StylesConfig = {
  option: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    color: '#11181c', // Change the text color to black
  }),
};

export interface SelectTypeDetail {
  [key: string]: {
    labelColumn: GetOptionLabel<any>;
    valueColumn: string;
    query: string;
    noOptionsMessage: string;
    responseKey: string;
    multiselect: boolean;
  };
}

const SelectTypeDetails: SelectTypeDetail = {
  [SelectType.Beach]: {
    labelColumn: (option: Location) => `${option.name} - ${option.city}`,
    valueColumn: 'id',
    query: '/api/spots',
    noOptionsMessage: 'No beaches found',
    responseKey: 'spots',
    multiselect: false,
  },
  [SelectType.User]: {
    labelColumn: (option: User) => `${option.firstName} ${option.lastName}`,
    valueColumn: 'id',
    query: '/api/users',
    noOptionsMessage: 'No users found',
    responseKey: 'users',
    multiselect: false,
  },
};

interface SearchSelectProps {
  type: SelectType;
  onChange: (option: any) => void;
  className?: string;
  defaultValue?: any;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  type,
  onChange,
  className,
  defaultValue,
}) => {
  const {
    labelColumn,
    valueColumn,
    query,
    noOptionsMessage,
    responseKey,
    multiselect,
  } = SelectTypeDetails[type];
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any | null>(
    defaultValue || null
  );

  const loadOptions: (
    input: string,
    callback: (options: OptionsOrGroups<any, GroupBase<any>>) => void
  ) => void | Promise<OptionsOrGroups<any, GroupBase<any>>> = debounce(
    async (
      input: string,
      callback: (options: OptionsOrGroups<any, GroupBase<any>>) => void
    ) => {
      if (input.length < 3) {
        setOptions([]);
        callback([]);
        return; // Return void when input length is less than 3
      }

      try {
        const response = await fetch(`${query}?searchQuery=${input}`);
        const data = await response.json();
        setOptions(data[responseKey]);
        callback(data[responseKey]);
        return; // Return void after setting options and invoking the callback
      } catch (error) {
        setOptions([]);
        callback([]);
        return; // Return void when there is an error
      }
    },
    1000
  ) as (
    input: string,
    callback: (options: OptionsOrGroups<any, GroupBase<any>>) => void
  ) => void | Promise<OptionsOrGroups<any, GroupBase<any>>>;

  const handleChange = (option: any) => {
    setSelectedOption(option);
    onChange(option);
  };
  return (
    <AsyncSelect
      id={`select-${SelectType[type]}`}
      name={SelectType[type]}
      menuPortalTarget={document.body}
      menuPosition={'fixed'}
      loadOptions={loadOptions}
      getOptionLabel={labelColumn}
      getOptionValue={(option) => option[valueColumn]}
      value={selectedOption}
      noOptionsMessage={() => noOptionsMessage || 'None found'}
      loadingMessage={() => 'Loading...'}
      onChange={handleChange}
      isMulti={multiselect}
      className={className}
      styles={customStyles}
    />
  );
};

export default SearchSelect;
