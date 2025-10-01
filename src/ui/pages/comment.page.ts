import { MainMenuComponent } from '@_src/ui/components/main-menu.component';
import { ArticlePage } from '@_src/ui/pages/article.page';
import { BasePage } from '@_src/ui/pages/base.page';
import { EditCommentView } from '@_src/ui/views/edit-comment.view';
import { Locator, Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  mainMenu: MainMenuComponent;
  commentBody: Locator;
  editButton: Locator;
  alertPopup: Locator;
  returnLink: Locator;

  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(this.page);
    this.commentBody = this.page.getByTestId('comment-body');
    this.editButton = this.page.getByTestId('edit');
    this.alertPopup = this.page.getByTestId('alert-popup');
    this.returnLink = this.page.getByTestId('return');
  }

  async gotoId(id: string): Promise<CommentPage> {
    await this.page.goto(`${this.url}?id=${id}`);
    return this;
  }

  async clickEditButton(): Promise<EditCommentView> {
    await this.editButton.click();
    return new EditCommentView(this.page);
  }

  async clickReturnLink(): Promise<ArticlePage> {
    await this.returnLink.click();
    return new ArticlePage(this.page);
  }
}
