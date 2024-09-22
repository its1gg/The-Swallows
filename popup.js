(() => {
    const $followButtons = '[data-testid$="-unfollow"]';
    const $confirmButton = '[data-testid="confirmationSheetConfirm"]';
  
    const retry = {
      count: 0,
      limit: 3,
    };
  
    const scrollToTheBottom = () => window.scrollTo(0, document.body.scrollHeight);
    const retryLimitReached = () => retry.count === retry.limit;
    const addNewRetry = () => retry.count++;
  
    const sleep = ({ seconds }) =>
      new Promise((proceed) => {
        console.log(`WAITING FOR ${seconds} SECONDS...`);
        setTimeout(proceed, seconds * 5000);
      });
  
    const unfollowAll = async (followButtons) => {
      console.log(`UNFOLLOWING ${followButtons.length} USERS...`);
      await Promise.all(
        followButtons.map(async (followButton) => {
          followButton && followButton.click();
          await sleep({ seconds: 1 });
          const confirmButton = document.querySelector($confirmButton);
          confirmButton && confirmButton.click();
        })
      );
    };
  
    const nextBatch = async () => {
      scrollToTheBottom();
      await sleep({ seconds: 1 });
  
      let followButtons = Array.from(document.querySelectorAll($followButtons));
      followButtons = followButtons.filter(b => b.parentElement?.parentElement?.querySelector('[data-testid="userFollowIndicator"]') === null)
      const followButtonsWereFound = followButtons.length > 0;
  
      if (followButtonsWereFound) {
        await unfollowAll(followButtons);
        await sleep({ seconds: 2 });
        return nextBatch();
      } else {
        addNewRetry();
      }
  
      if (retryLimitReached()) {
        console.log(`NO ACCOUNTS FOUND, SO I THINK WE'RE DONE`);
        console.log(`RELOAD PAGE AND RE-RUN SCRIPT IF ANY WERE MISSED`);
      } else {
        await sleep({ seconds: 2 });
        return nextBatch();
      }
    };
  
    nextBatch();
  })();