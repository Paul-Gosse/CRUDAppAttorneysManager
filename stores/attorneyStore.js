import { types, flow } from 'mobx-state-tree';

// The AttorneyStore model definition using MobX-State-Tree
export const AttorneyStore = types
  .model({
    // Defining the structure of the store's state
    attorneys: types.array(
      types.model({
        id: types.identifierNumber,
        firstName: types.string,
        lastName: types.string,
        specialty: types.string,
        phoneNumber: types.string,
        email: types.string,
        indicator: types.optional(types.string, ''),
        countryPhone: types.optional(types.string, ''),
        description: types.optional(types.string, ''),
        totalCases: types.optional(types.number, 0),
        wonCases: types.optional(types.number, 0),
      })
    ),
    isLoading: types.boolean,
  })
  .actions((self) => ({
    // Action to update the list of attorneys in the store
    setAttorneys(newAttorneys) {
      self.attorneys = newAttorneys;
    },

    // Action to add a new attorney to the store
    addAttorney(attorney) {
      self.attorneys.push(attorney);
    },

    // Asynchronous flow to fetch attorneys from the API
    fetchAttorneys: flow(function* () {
      self.isLoading = true;
      try {
        // Fetch data from the API endpoint
        const response = yield fetch("/api/attorneys");
        const data = yield response.json();
        self.attorneys = data;
      } catch (error) {
        console.error("Failed to fetch attorneys:", error);
      } finally {
        self.isLoading = false;
      }
    }),

    // Asynchronous flow to delete an attorney by their id
    deleteAttorney: flow(function* (id) {
      self.isLoading = true;
      try {
        // Send a DELETE request to the API to delete the attorney by id
        const response = yield fetch(`/api/attorneys?id=${Number(id)}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the deleted attorney from the store's list of attorneys
          self.attorneys = self.attorneys.filter((attorney) => attorney.id !== id);
        } else {
          console.error(`Failed to delete attorney with id ${id}.`);
        }
      } catch (error) {
        console.error("Error deleting attorney:", error);
      } finally {
        self.isLoading = false;
      }
    }),
  }));

// Creating an instance of the AttorneyStore with initial state values
export const attorneyStore = AttorneyStore.create({
  attorneys: [],
  isLoading: false,
});
