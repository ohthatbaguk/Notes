import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import styles from "../../app.module.scss";
import React from "react";

interface SearchInputParams {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rawSearch: string | ReadonlyArray<string> | number | undefined;
  clearSearch: () => void;
}

export default function SearchInput({
  handleSearchChange,
  rawSearch,
  clearSearch,
}: SearchInputParams) {
  const ref = React.useRef<HTMLInputElement>(null);

  return (
    <InputGroup size="md">
      <Input
        ref={ref}
        onChange={handleSearchChange}
        value={rawSearch}
        className={styles.search}
        ml="30px"
        placeholder="Search"
        width={60}
      />
      <InputRightElement width="9rem">
        <Button onClick={clearSearch} colorScheme="pink" h="1.75rem" size="sm">
          Delete
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
