import { action, observable } from 'mobx';

import ErrorContainer from './ErrorContainer';
import { AccountDeploysResult, EventService } from 'casper-client-sdk';

export class DeployInfoListContainer {
  @observable deployInfosList: AccountDeploysResult;
  @observable pageNumber: number = 1;
  @observable deployHash: string = '';
  @observable pageSize: number = 10;

  constructor(
    private errors: ErrorContainer,
    private eventService: EventService
  ) {}

  /** Call whenever the page switches to a new account. */
  @action
  init(deployHash: string) {
    this.deployHash = deployHash;
    this.deployInfosList = {
      data: [],
      pageCount: 0,
      itemCount: 0,
      pages: []
    };
  }

  @action
  async fetchPage(deployHash: string) {
    this.deployHash = deployHash;
    this.fetchData();
  }

  @action
  async fetchData() {
    if (this.deployHash.length < 0) return;
    // fixme
    await this.errors.capture(
      this.eventService
        .getAccountDeploys(this.deployHash, this.pageNumber, this.pageSize)
        .then(response => {
          this.deployInfosList = response;
        })
    );
  }
}
