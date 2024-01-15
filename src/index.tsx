import { useState } from "react";
import {
  ActionPanel,
  List,
  Action,
  Detail,
  getPreferenceValues,
  openExtensionPreferences,
} from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { ApiResponse } from "./types";

export default function Command() {
  const { token } = getPreferenceValues();
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useFetch<ApiResponse>(
    `https://api.discogs.com/database/search?q=${searchText}&format=Vinyl&per_page=8&token=${token}`,
    { keepPreviousData: true },
  );

  if (!token) {
    return (
      <Detail
        markdown="PAT key incorrect. Please update it in extension preferences and try again."
        actions={
          <ActionPanel>
            <Action
              title="Open Extension Preferences"
              onAction={openExtensionPreferences}
            />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <List
      isLoading={isLoading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      throttle
      filtering={false}
    >
      {searchText === "" ? (
        <List.EmptyView title="Type something to get started" />
      ) : (
        (data?.results || []).map((item) => (
          <List.Item
            icon={item.thumb}
            title={item.title}
            accessories={[
              {
                text: item.user_data.in_collection
                  ? `📗`
                  : item.user_data.in_wantlist
                    ? "👀"
                    : null,
              },
            ]}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={`https://discogs.com${item.uri}`} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
