document.addEventListener('DOMContentLoaded', () => {
    const claimLootboxBtn = document.getElementById('claim-lootbox-btn');
    const openLootboxBtn = document.getElementById('open-lootbox-btn');
    const cratePopup = document.getElementById('crate-popup');
    const lootboxResult = document.getElementById('lootbox-result');
    const unlockedItem = document.getElementById('unlocked-item');
    const crateImg = document.getElementById('crate-img');

    claimLootboxBtn.addEventListener('click', () => {
        fetch('/claim_lootbox', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: 'user1' }) // Replace 'user1' with actual user ID
        })
        .then(response => response.json())
        .then(data => {
            if (data.error !=  "Already claimed lootbox today") {
                claimLootboxBtn.disabled = true;
                openLootboxBtn.disabled = false;
                cratePopup.classList.remove('hidden');
                cratePopup.classList.add('hidden');
                lootboxResult.classList.remove('hidden');
                unlockedItem.textContent = `You unlocked: ${data.claimedItems[0]}`;
            } else {
                openLootboxBtn.disabled = true;
                cratePopup.classList.remove('hidden');
                cratePopup.classList.add('hidden');
                lootboxResult.classList.remove('hidden');
                unlockedItem.textContent = `${data.error}, Claim it Tomorrow!`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    openLootboxBtn.addEventListener('click', () => {
        fetch('/open_lootbox', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: 'user1' }) // Replace 'user1' with actual user ID
        })
        .then(response => response.json())
        .then(data => {
            if (data.error != "No remaining lootboxes to open") {
                cratePopup.style.display = 'flex'; // Show the crate popup
                crateImg.src = 'closed-lootbox.gif'; // Reset crate image to closed state
                setTimeout(() => {
                    unlockedItem.textContent = `You unlocked: ${data.lootboxItem}`;
                }, 2100);
            } else {
                document.getElementById('lootbox-result').classList.remove('hidden');
                unlockedItem.textContent = `There is no Creates Left!`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

function openCrate() {
    const crateImg = document.getElementById('crate-img');
    crateImg.src = 'open-lootbox.gif'; // Change crate image to GIF representing opening animation
    setTimeout(() => {
        closePopup(); // Automatically close the popup after the animation ends (adjust timing as needed)
        document.getElementById('lootbox-result').classList.remove('hidden');
    }, 1900); // Adjust timing based on the duration of the GIF animation
}

function closePopup() {
    const cratePopup = document.getElementById('crate-popup');
    cratePopup.style.display = 'none'; // Hide the crate popup
}