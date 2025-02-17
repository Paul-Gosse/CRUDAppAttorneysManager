import { types, flow } from 'mobx-state-tree';

export const AttorneyStore = types
  .model({
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
    setAttorneys(newAttorneys) {
      self.attorneys = newAttorneys;
    },

    addAttorney(attorney) {
      self.attorneys.push(attorney);
    },

    fetchAttorneys: flow(function* () {
      self.isLoading = true;
      try {
        const response = yield fetch("/api/attorneys");
        const data = yield response.json();
        self.attorneys = data;
      } catch (error) {
        console.error("Failed to fetch attorneys:", error);
      } finally {
        self.isLoading = false;
      }
    }),

    deleteAttorney: flow(function* (id) {
      self.isLoading = true;
      try {
        const response = yield fetch(`/api/attorneys?id=${Number(id)}`, {
          method: 'DELETE',
        });

        if (response.ok) {
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

export const attorneyStore = AttorneyStore.create({
  attorneys: [],
  isLoading: false,
});
